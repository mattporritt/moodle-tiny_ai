<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * This is the external API for this component.
 *
 * @package    tiny_ai
 * @copyright   2023 Matt Porritt <matt.porritt@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace tiny_ai;

use core\http_client;

/**
 * Process AI API calls and generate content responses.
 *
 * @copyright   2023 Matt Porritt <matt.porritt@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class ai {
    // API key.
    private string $apikey;

    // API org id.
    private string $orgid;

    // API endpoint.
    private string $aiendpoint = 'https://api.openai.com/v1/chat/completions';

    // HTTP Client.
    private http_client $client;

    // AI model.
    private string $model = 'gpt-4';

    // AI "personality" options.
    private array $personalityoptions =[
        0 => 'You are an undergraduate Lecturer at a university',
        1 => 'You are a postgraduate Lecturer at a university',
        2 => 'You are a teaching assistant at a university',
        3 => 'You are a high school teacher',
        4 => 'You are a primary school teacher',
        5 => 'You are an industry professional',
        6 => 'You are a student mentor',
    ];

    // AI personality.
    private string $personality;

    /**
     * Class constructor.
     */
    public function __construct() {
        // Get api key from config.
        $this->apikey = get_config('tiny_ai', 'apikey');
        // Get api org id from config.
        $this->orgid = get_config('tiny_ai', 'orgid');
        // Get personality from config.
        $this->personality = $this->personalityoptions[get_config('tiny_ai', 'personality')];
        // Create http client.
        $this->client = new http_client([
            'base_uri' => $this->aiendpoint,
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $this->apikey,
                'OpenAI-Organization' => $this->orgid,
            ]
        ]);
    }

    /**
     * Generate content from the AI service.
     *
     * @param string $prompttext The prompt text.
     * @param ?http_client $client The http client.
     * @return \stdClass The generated content.
     */
    public function generate_content(string $prompttext, ?http_client $client = null): \stdClass {
        // Allow for dependency injection of http client.
        if ($client) {
            $this->client = $client;
        }

        // Create the AI request object.
        $requestjson = json_encode($this->generate_request_object($prompttext));

        // Call the AI service.
        //$response = $this->client->request('POST', '', [
        //    'body' => $requestjson,
        //]);
        //
        //$responsebody = $response->getBody();
        //$bodyobj = json_decode($responsebody->getContents());

        $responseobj = new \stdClass();
        $responseobj->prompttext = $prompttext;
        $responseobj->model = $this->model;
        $responseobj->personality = $this->personality;
        $responseobj->generateddate = time();
        //$responseobj->generatedcontent = $bodyobj->choices[0]->message->content;
        $responseobj->generatedcontent = "This is a test \n response from the \n\n AI service.";

        return $responseobj;
    }

    /**
     * Generate request object ready to send to the AI service.
     *
     * @param string $prompttext The prompt text.
     */
    private function generate_request_object(string $prompttext): \stdClass {
        // Create the AI request object.
        $systemobj = new \stdClass();
        $systemobj->role = 'system';
        $systemobj->content = $this->personality;

        $userobj = new \stdClass();
        $userobj->role = 'user';
        $userobj->content = $prompttext;

        $requestobj = new \stdClass();
        $requestobj->model = $this->model;
        $requestobj->messages = [$systemobj, $userobj];

        return $requestobj;
    }
}
