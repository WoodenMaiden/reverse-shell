# Use the official PHP image as the base image
FROM php:latest

RUN composer require slim/slim:"4.*"
RUN composer require slim/psr7


# Copy the index.php file into the container
COPY index.php /var/www/html/

# Set the working directory
WORKDIR /var/www/html
