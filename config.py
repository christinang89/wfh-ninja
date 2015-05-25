import os, sys

SESSION_TYPE = 'memcached'
SECRET_KEY = 'super secret key'
SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
ADMIN_REGISTRATION_SECRET_KEY = 'wfh-ninja-admin'