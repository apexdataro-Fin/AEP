from django.http import JsonResponse
from django.views.decorators.http import require_http_methods


@require_http_methods(["GET"])
def api_root(request):
    """API root endpoint returning available endpoints."""
    return JsonResponse(
        {
            "name": "AEP - Educational Platform API",
            "version": "1.0.0",
            "endpoints": {
                "health": "/api/health/",
                "admin": "/admin/",
            },
        }
    )


@require_http_methods(["GET"])
def health_check(request):
    """Health check endpoint."""
    from django.db import connections
    from django.db.utils import OperationalError

    db_status = "ok"
    try:
        connections["default"].cursor()
    except OperationalError:
        db_status = "error"

    return JsonResponse(
        {
            "status": "ok" if db_status == "ok" else "degraded",
            "database": db_status,
        }
    )
