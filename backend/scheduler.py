"""Background task scheduler for interview status updates.

Import paths updated to reflect unified package layout (no top-level
`backend` module). Fail gracefully if APScheduler or interview utils are
unavailable so the app can still start in minimal environments.
"""

import os
import atexit
from apscheduler.schedulers.background import BackgroundScheduler  # type: ignore
from apscheduler.triggers.interval import IntervalTrigger  # type: ignore

try:  # Prefer new unified path
    from app.services.recruai.utils.interview_utils import update_expired_interviews  # type: ignore
except Exception:  # pragma: no cover
    def update_expired_interviews():  # fallback no-op
        return 0

scheduler = BackgroundScheduler()
_SCHEDULER_STARTED = False  # module-level flag


def init_scheduler():
    """Initialize and start the background scheduler once.

    Avoid duplicate starts caused by Flask's reloader by:
    - Only starting in the reloader's main process (WERKZEUG_RUN_MAIN == 'true')
      OR when the environment variable is absent (non-reloader invocation).
    - Guarding with a module-level flag `_SCHEDULER_STARTED`.
    """
    global _SCHEDULER_STARTED
    if _SCHEDULER_STARTED:
        return

    is_reloader_main = os.environ.get("WERKZEUG_RUN_MAIN") == "true"
    # If reloader variable exists but is not 'true', skip (initial spawn).
    if os.environ.get("WERKZEUG_RUN_MAIN") and not is_reloader_main:
        return

    try:
        scheduler.add_job(
            func=update_expired_interviews,
            trigger=IntervalTrigger(minutes=5),
            id="update_expired_interviews",
            name="Update expired interviews to completed status",
            replace_existing=True,
        )
        scheduler.start()
        atexit.register(lambda: shutdown_scheduler())
        _SCHEDULER_STARTED = True
        print("Background scheduler initialized with interview status update job")
    except Exception as exc:  # pragma: no cover
        print(f"Warning: Scheduler init failed: {exc}")


def shutdown_scheduler():  # pragma: no cover
    """Shutdown the scheduler if running."""
    global _SCHEDULER_STARTED
    try:
        if scheduler.running:
            scheduler.shutdown(wait=False)
            _SCHEDULER_STARTED = False
            print("Background scheduler shut down")
    except Exception:
        pass