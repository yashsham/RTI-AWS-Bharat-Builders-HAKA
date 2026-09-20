"""Structured logging module for RTIKit Backend."""
import logging
import sys

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s (req_id=%(threadName)s): %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    return logging.getLogger("rtikit")
