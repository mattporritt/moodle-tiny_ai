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
 * Tiny AI Mark Changed text.
 *
 * This module marks text that was returned by the AI service
 * and that has been changed by a human prior to being inserted.
 *
 * @module      tiny_ai/ui
 * @copyright   2023 Matt Porritt <matt.porritt@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


/**
 * Wraps the given edited section in a span tag with a 'user-edited' class.
 *
 * @param {string} editedSection The edited section of the text.
 * @returns {Promise<string>} A promise that resolves with the wrapped edited section.
 */
export function wrapInSpan(editedSection) {
    return new Promise((resolve, reject) => {
        try {
            let wrappedText = `<span class="user-edited">${editedSection}</span>`;
            resolve(wrappedText);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Finds the differences between the original and edited text.
 * @param {string} originalText The original text.
 * @param {string} editedText The edited text.
 * @returns {Array<Object>} An array of difference objects with start, end, and text properties.
 */
function findDifferences(originalText, editedText) {
    let differences = [];
    let i = 0;

    while (i < originalText.length || i < editedText.length) {
        let originalChar = originalText[i];
        let editedChar = editedText[i];

        if (originalChar === editedChar) {
            i++;
        } else {
            let start = i;
            while (originalChar !== editedChar && i < editedText.length) {
                i++;
                originalChar = originalText[i];
                editedChar = editedText[i];
            }
            let editedSection = editedText.slice(start, i);
            differences.push({start, end: i, text: editedSection});
        }
    }

    return differences;
}

/**
 * Wraps the edited sections of the text in span tags with a 'user-edited' class.
 * @param {string} originalText The original text.
 * @param {string} editedText The edited text.
 * @returns {Promise<string>} A promise that resolves with the text containing wrapped edited sections.
 */
export function wrapEditedSections(originalText, editedText) {
    return new Promise(async (resolve, reject) => {
        try {
            let differences = findDifferences(originalText, editedText);
            let wrappedText = editedText;

            for (let i = differences.length - 1; i >= 0; i--) {
                let {start, end, text} = differences[i];
                let wrappedSection = await wrapInSpan(text);
                wrappedText = wrappedText.slice(0, start) + wrappedSection + wrappedText.slice(end);
            }

            resolve(wrappedText);
        } catch (error) {
            reject(error);
        }
    });
}
