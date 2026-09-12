#!/usr/bin/python3
"""OmaHack bounded no-follow file reader (marketplace security hardening).

Reads one of two fixed allowlisted files using descriptor-relative checks:
O_NOFOLLOW open (plus symlink-component walk under $HOME), regular-file and
ownership validation on the opened fd, then a strictly capped read.

Usage: safe_read.py <target|clipboard>
Exit 0 printing raw bytes (possibly empty) on success or benign absence.
Exit 2 printing nothing on any violation or error.

Never follows symlinks, never opens non-regular files (FIFO/device/socket/dir),
never reads files owned by another uid, never reads more than the cap, and
never accepts a path from the caller (purpose allowlist only).
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


def no_symlink_components(path, stop_at):
    """Reject if path or any component down to (excluding) stop_at is a symlink."""
    cur = path
    while True:
        try:
            if os.path.islink(cur):
                return False
        except OSError:
            return False
        parent = os.path.dirname(cur)
        if parent == cur or cur == stop_at:
            return True
        cur = parent


def main():
    if len(sys.argv) != 2 or sys.argv[1] not in CAPS:
        return 2
    purpose = sys.argv[1]
    home = os.path.expanduser("~")
    if not home or home == "~" or "\x00" in home:
        return 2
    rel = REL_PATHS[purpose]
    if os.path.isabs(rel) or ".." in rel.split(os.sep):
        return 2
    path = os.path.join(home, rel)
    if not no_symlink_components(path, home):
        return 2
    cap = CAPS[purpose]
    try:
        # O_NONBLOCK so a FIFO can never hang the open; O_NOFOLLOW rejects a
        # trailing symlink; the fd is validated below before any read.
        fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    except OSError:
        return 2
    try:
        st = os.fstat(fd)
        if not stat.S_ISREG(st.st_mode):
            return 2
        if st.st_uid != os.getuid():
            return 2
        out = b""
        remaining = cap
        while remaining > 0:
            try:
                chunk = os.read(fd, min(65536, remaining))
            except OSError:
                return 2
            if not chunk:
                break
            out += chunk
            remaining -= len(chunk)
    except OSError:
        return 2
    finally:
        try:
            os.close(fd)
        except OSError:
            pass
    try:
        sys.stdout.buffer.write(out)
    except OSError:
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
