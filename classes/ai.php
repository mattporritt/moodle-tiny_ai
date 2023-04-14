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

/**
 * Process AI API calls and generate content responses.
 *
 * @copyright   2023 Matt Porritt <matt.porritt@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class ai {
    // API key.
    private $apikey;

    // API org id.
    private $orgid;
    
    /**
     * Class constructor.
     */
    public function __construct() {
        // Get api key from config.
        $this->apikey = get_config('tiny_ai', 'apikey');
        // Get api org id from config.
        $this->orgid = get_config('tiny_ai', 'orgid');
    }

    /**
     * Generate content from the AI service.
     *
     * @since  Moodle 4.2
     * @param string $prompttext The prompt text.
     * @return string The generated content.
     */
    public static function generate_content($prompttext) {

        return $prompttext;
    }
}
