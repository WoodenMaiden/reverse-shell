# Use the official PHP image as the base image
FROM php:latest

RUN composer require slim/slim:"4.*"
RUN composer require slim/psr7
RUN composer require illuminate/database
RUN composer require illuminate/events
RUN composer require vlucas/phpdotenv


# Copy the index.php file into the container
COPY index.php /var/www/html/
COPY index.html /var/www/html/


# Set the working directory
WORKDIR /var/www/html
