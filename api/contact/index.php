<?php
header("Access-Control-Allow-Origin: *");
$rest_json = file_get_contents("php://input");
$newPostData = json_decode($_POST['document']);

//? The first step is to create the task content.
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, getenv('CLICKUP_LIST_URL'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_HEADER, FALSE);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

curl_setopt($ch, CURLOPT_POST, TRUE);

curl_setopt($ch, CURLOPT_POSTFIELDS, "{
	\"name\": \"" . $newPostData->name . "\",
	\"description\": \"" . $newPostData->description . "\",
	\"custom_fields\": [
    {
      \"id\": \"" . $newPostData->custom_fields[0]->id . "\",
      \"value\": " . (int)$newPostData->custom_fields[0]->value . "
    },
		{
			\"id\": \"" . $newPostData->custom_fields[1]->id . "\",
      \"value\": \"" . $newPostData->custom_fields[1]->value . "\"
		},
		{
			\"id\": \"" . $newPostData->custom_fields[2]->id . "\",
      \"value\": \"" . $newPostData->custom_fields[2]->value . "\"
		},
		{
			\"id\": \"" . $newPostData->custom_fields[3]->id . "\",
      \"value\": \"" . $newPostData->custom_fields[3]->value . "\"
		},
		{
			\"id\": \"" . $newPostData->custom_fields[4]->id . "\",
      \"value\": \"" . $newPostData->custom_fields[4]->value . "\"
		}
  ]
}");

curl_setopt($ch, CURLOPT_HTTPHEADER, array(
	'Authorization: ' . getenv('CLICKUP_PK') . '',
	'Content-Type: application/json'
));

$response = curl_exec($ch);
curl_close($ch);

$taskId = json_decode($response)->id;

//? The second step is to upload the files.

foreach ($_FILES as $file) {

	$fileName = $file['name'];
	$fileContent = file_get_contents($file['tmp_name']);
	$abs_path = __DIR__ . '/uploads/' . $fileName;
	$populateFile = file_put_contents($abs_path, $fileContent);

	$curl = curl_init();

	curl_setopt_array($curl, array(
		CURLOPT_URL => 'https://api.clickup.com/api/v2/task/' . $taskId . '/attachment',
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => '',
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 0,
		CURLOPT_SSL_VERIFYPEER => false,
		CURLOPT_FOLLOWLOCATION => true,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => 'POST',
		CURLOPT_POSTFIELDS => array('attachment' => new CURLFILE($abs_path), 'filename' => $fileName),
		CURLOPT_HTTPHEADER => array(
			'Content-Type: multipart/form-data',
			'Authorization: ' . getenv('CLICKUP_PK') . ''
		),
	));

	$response = curl_exec($curl);

	curl_close($curl);
	unlink($abs_path);
}

echo json_encode($response);
