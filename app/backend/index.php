<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$capsule = new Capsule;

$capsule->addConnection([
    'driver'    => 'pgsql',
    'host'      => $_ENV['DB_HOST'],
    'database'  => $_ENV['DB_DATABASE'],
    'username'  => $_ENV['DB_USERNAME'],
    'password'  => $_ENV['DB_PASSWORD'],
    'charset'   => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix'    => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

// Check and create the 'views' table if it doesn't exist
if (!Capsule::schema()->hasTable('views')) {
    Capsule::schema()->create('views', function ($table) {
        $table->string('ip');
        $table->string('filename');
        $table->integer('view_count')->default(1);
        $table->primary(['ip', 'filename']);
    });
}

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

    // Record view in the database
    $ip = $request->getAttribute('ip_address'); // Get IP address from the request
    $view = Capsule::table('views')->where('ip', $ip)->where('filename', $filename)->first();

    if ($view) {
        Capsule::table('views')
            ->where('ip', $ip)
            ->where('filename', $filename)
            ->increment('view_count');
    } else {
        Capsule::table('views')->insert([
            'ip' => $ip,
            'filename' => $filename
        ]);
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
