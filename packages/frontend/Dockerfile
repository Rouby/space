FROM lipanski/docker-static-website

COPY . .
COPY ./httpd.conf /httpd.conf

CMD ["/busybox-httpd", "-f", "-v", "-p", "3000", "-c", "httpd.conf"]
