
# Tiny AI Plugin for Moodle LMS #

The Tiny AI Plugin is a Moodle LMS plugin that enhances the TinyMCE editor by enabling the insertion of AI-generated text directly from the editor. 
Users can edit and regenerate the AI-generated response before it is inserted into their content. 

The plugin also features administration settings for entering the AI API key and organization key, as well as the ability to restrict plugin usage based on Moodle capabilities.

## Table of Contents ##

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [License](#license)

## Features ##

- Integration with the TinyMCE editor in Moodle LMS
- Insertion of AI-generated text
- Editing and regeneration of AI-generated responses
- Administration settings for entering AI API key and organization key
- Restrict usage based on Moodle capabilities

## Installation

## Installing via uploaded ZIP file ##

1. Log in to your Moodle site as an admin and go to _Site administration >
   Plugins > Install plugins_.
2. Upload the ZIP file with the plugin code. You should only be prompted to add
   extra details if your plugin type is not automatically detected.
3. Check the plugin validation report and finish the installation.

## Installing manually ##

The plugin can be also installed by putting the contents of this directory to

    {your/moodle/dirroot}/lib/editor/tiny/plugins/ai

Afterwards, log in to your Moodle site as an admin and go to _Site administration >
Notifications_ to complete the installation.

Alternatively, you can run

    $ php admin/cli/upgrade.php

to complete the installation from the command line.

## Configuration

To configure the plugin, follow these steps:

1. Navigate to `Site administration > Plugins > Text editors > TinyMCE HTML editor > Tiny AI Plugin`.
2. Enter the AI API key and organization key in the respective fields.
3. Save the settings.

To restrict plugin usage based on Moodle capabilities, follow these steps:

1. Navigate to `Site administration > Users > Permissions > Define roles`.
2. Select the desired role to edit.
3. Under the "Advanced" tab, search for the `tiny/ai:use` capability.
4. Check or uncheck the box next to the `tiny/ai:use` capability to enable or disable the feature for that role.
5. Save the changes.

## Usage

1. Create or edit a Moodle activity or resource that uses the TinyMCE editor.
2. Click on the "Tiny AI" icon in the editor's toolbar.
3. The AI-generated text will be displayed in a modal window.
4. Edit the text as desired, or click "Regenerate" to request a new AI-generated response.
5. Click "Insert" to add the AI-generated text to your content.

## License ##

2023 Matt Porritt <matt.porritt@moodle.com>

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program.  If not, see <https://www.gnu.org/licenses/>.
