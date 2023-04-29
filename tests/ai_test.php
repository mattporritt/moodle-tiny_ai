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

use core\http_client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Response;
use tiny_ai\ai;

/**
 * Unit tests for the ai class in the tiny_ai plugin.
 *
 * @package    tiny_ai
 * @category   test
 * @copyright   2023 Matt Porritt <matt.porritt@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * @coversDefaultClass \tiny_ai\ai
 */
class ai_test extends \advanced_testcase {

    /**
     * Test the generate content function.
     *
     * @since  Moodle 4.2
     * @return void
     */
    public function test_generate_content() {
        $prompttext = 'Provide a brief introduction to a cloud computing course.';
        set_config('apikey', 'abc123', 'tiny_ai');
        set_config('orgid', 'abc123', 'tiny_ai');

        $mock = new MockHandler([
                new Response(200,),
                new Response()
        ]);
        $client = new \core\http_client(['mock' => $mock]);

        $ai = new ai();
        $result = $ai->generate_content($prompttext);
    }
}
