$response = Invoke-WebRequest -Uri 'https://api.github.com/repos/ashuthosh-mr/ashuthosh-mr.github.io/actions/jobs/92227304893/logs'
$lines = $response.Content -split "`n"
$lines[-50..-1]
