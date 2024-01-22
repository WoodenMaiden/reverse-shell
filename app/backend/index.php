<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();

// Endpoint to get the content of a specific file
$app->get('/file/{filename}', function (Request $request, Response $response, array $args) {
    $filename = $args['filename'];
    $filePath = '/tmp/' . $filename; // You should specify your actual path here

    if (file_exists($filePath)) {
        $content = shell_exec('cat ' . escapeshellarg($filePath));
        $response->getBody()->write($content);
    } else {
        $response->getBody()->write("File not found");
        return $response->withStatus(404);
    }

    return $response;
});

// Endpoint to list all files in /tmp directory with limit and offset
$app->get('/file', function (Request $request, Response $response) {
    $params = $request->getQueryParams();
    $limit = $params['limit'] ?? 10; // Default limit is 10
    $offset = $params['offset'] ?? 0; // Default offset is 0

    $allFiles = scandir('/tmp');
    $files = array_slice($allFiles, $offset, $limit);

    $response->getBody()->write(json_encode($files));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/', function (Request $request, Response $response) {
    $html = file_get_contents(__DIR__ . '/index.html');
    $response->getBody()->write($html);
    return $response->withHeader('Content-Type', 'text/html');
});

$app->run();
