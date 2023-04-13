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

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_value;

/**
 * This is the external API for this component.
 *
 * @copyright   2023 Matt Porritt <matt.porritt@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class external extends external_api {

    /**
     * Generate content parameters.
     *
     * @since  Moodle 4.2
     * @return external_function_parameters
     */
    public static function generate_content_parameters() {
        return new external_function_parameters(
                [
                    'jsondata' => new external_value(
                            PARAM_RAW,
                            'The data encoded as a json array',
                            VALUE_REQUIRED),
                ]
        );
    }

    /**
     * Generate content from the AI service.
     *
     * @since  Moodle 4.2
     * @param string $jsondata The data encoded as a json array.
     * @return string
     */
    public static function generate_content(string $jsondata) {
        \core\session\manager::write_close(); // Close session early this is a read op.

        // Parameter validation.
        self::validate_parameters(
                self::generate_content_parameters(),
                array('jsondata' => $jsondata)
        );

        $data = json_decode($jsondata, true);

        // Context validation and permission check.
        // Get the context from the passed in ID.
        $context = \context::instance_by_id($data['contextid']);

        // Check the user has permission to use the AI service.
        self::validate_context($context);
        require_capability('tiny/ai:use', $context);

        // Execute API call.
        $ai = new \tiny_ai\ai();
        $contentresponse= $ai->generate_content($data['prompttext']);

        return json_encode($contentresponse);
    }

    /**
     * Generate content return value.
     *
     * @since  Moodle 4.2
     * @return external_value
     */
    public static function generate_content_returns() {
        return new external_value(PARAM_RAW, 'Event JSON');
    }
}
