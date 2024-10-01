FROM lipanski/docker-static-website

COPY . .

RUN echo "E404:index.html" > httpd.conf

CMD ["/busybox-httpd", "-f", "-v", "-p", "3000", "-c", "httpd.conf"]
