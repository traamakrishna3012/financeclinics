FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
# Install system build dependencies required for some Python packages (lxml, pycairo, reportlab, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libffi-dev \
    libssl-dev \
    python3-dev \
    libxml2-dev \
    libxslt1-dev \
    libjpeg-dev \
    zlib1g-dev \
    pkg-config \
    libcairo2-dev     libpango1.0-dev     libgdk-pixbuf-xlib-2.0-dev \
    meson \
    ninja-build \
    libfreetype6-dev \
    libpng-dev \
    default-libmysqlclient-dev \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install gunicorn \
    && apt-get purge -y --auto-remove build-essential gcc python3-dev meson ninja-build \
    && rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . .

# Set environment variables
ENV FLASK_APP=wsgi.py
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 5000

# Run with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--threads", "2", "wsgi:application"]
