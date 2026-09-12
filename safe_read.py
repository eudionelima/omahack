#!/usr/bin/python3
"""OmaHack bounded no-follow file reader (marketplace security hardening).

Reads one of two fixed allowlisted files through a TOCTOU-free boundary:
starting from a retained fd of "/", every path component is opened with
O_RDONLY | O_DIRECTORY | O_NOFOLLOW | O_CLOEXEC into a retained dir_fd
(failing on symlinks and non-directories, owned by uid or root only), and
the final file is opened relative to its retained parent fd with O_NOFOLLOW,
then validated as a regular file owned by the caller uid before a strictly
capped read. No pathname is ever re-resolved after its check.

Must be invoked isolated with a closed minimal environment, e.g.:
  env -i HOME=$HOME /usr/bin/python3 -I safe_read.py <target|clipboard>

Usage: safe_read.py <target|clipboard>
Exit 0 printing raw bytes (possibly empty) on success or benign absence.
Exit 2 printing nothing on any violation or error.
"""
import os
import stat
import sys

CAPS = {
    "target": 1024,
    "clipboard": 262144,
}

REL_PATHS = {
    "target": ".config/bin/target",
    "clipboard": ".local/state/omarchy/clipboard-history.json",
}


def fail():
    return 2


def open_component(dir_fd, name, expect_dir):
    """Open one component relative to a retained dir_fd. Never follows symlinks."""
    if not name or name in (".", "..") or "/" in name or "\x00" in name:
        return -1
    flags = os.O_RDONLY | os.O_NOFOLLOW | os.O_CLOEXEC | os.O_NONBLOCK
    if expect_dir:
        flags |= os.O_DIRECTORY
    try:
        fd = os.open(name, flags, dir_fd=dir_fd)
    except OSError:
        return -1
    try:
        st = os.fstat(fd)
    except OSError:
        os.close(fd)
        return -1
    if expect_dir:
        if not stat.S_ISDIR(st.st_mode):
            os.close(fd)
            return -1
        # Intermediate dirs must be system-owned or self-owned: an attacker
        # cannot plant a replacement inside either.
        if st.st_uid != 0 and st.st_uid != os.getuid():
            os.close(fd)
            return -1
    return fd


def open_bounded(path_parts, cap):
    """Walk from retained / fd; return capped bytes or None on violation."""
    owned = []
    try:
        dir_fd = os.open("/", os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW | os.O_CLOEXEC)
        owned.append(dir_fd)
        for comp in path_parts[:-1]:
            nd = open_component(dir_fd, comp, True)
            if nd < 0:
                return None
            owned.append(nd)
            dir_fd = nd
        fd = open_component(dir_fd, path_parts[-1], False)
        if fd < 0:
            return None
        owned.append(fd)
        st = os.fstat(fd)
        if not stat.S_ISREG(st.st_mode):
            return None
        if st.st_uid != os.getuid():
            return None
        out = b""
        remaining = cap
        while remaining > 0:
            chunk = os.read(fd, min(65536, remaining))
            if not chunk:
                break
            out += chunk
            remaining -= len(chunk)
        return out
    except OSError:
        return None
    finally:
        for owned_fd in owned:
            try:
                os.close(owned_fd)
            except OSError:
                pass


def main():
    if len(sys.argv) != 2 or sys.argv[1] not in CAPS:
        return fail()
    purpose = sys.argv[1]
    home = os.path.expanduser("~")
    if not home or home == "~" or "\x00" in home or not os.path.isabs(home):
        return fail()
    rel = REL_PATHS[purpose]
    if os.path.isabs(rel) or ".." in rel.split(os.sep):
        return fail()
    parts = [p for p in (home + os.sep + rel).split(os.sep) if p != ""]
    if not parts:
        return fail()
    data = open_bounded(parts, CAPS[purpose])
    if data is None:
        return fail()
    try:
        sys.stdout.buffer.write(data)
    except OSError:
        return fail()
    return 0


if __name__ == "__main__":
    sys.exit(main())
