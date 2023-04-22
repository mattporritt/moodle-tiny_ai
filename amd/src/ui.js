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
 * Tiny AI UI.
 *
 * @module      tiny_ai/ui
 * @copyright   2023 Matt Porritt <matt.porritt@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import ModalFactory from 'core/modal_factory';
import ModalEvents from 'core/modal_events';
import AiModal from 'tiny_ai/modal';
import {getContextId} from 'tiny_ai/options';
import Ajax from 'core/ajax';
import Templates from 'core/templates';
import {wrapEditedSections} from 'tiny_ai/textmark';

let responseObj = null;

/**
 * Display the modal when the AI button is clicked.
 *
 * @param {TinyMCE.editor} editor The tinyMCE editor instance.
 */
export const displayModal = async(editor) => {
    const modalObject = await ModalFactory.create({
        type: AiModal.TYPE,
        templateContext: getTemplateContext(editor),
        large: true,
    });

    const modalroot = await modalObject.getRoot();
    const root = modalroot[0];

    modalObject.show();
    modalroot.on(ModalEvents.hidden, () => {
        modalObject.destroy();
    });

    root.addEventListener('click', (e) => {
        const submitBtn = e.target.closest('[data-action="generate"]');
        const insertBtn = e.target.closest('[data-action="inserter"]');
        const cancelBtn = e.target.closest('[data-action="cancel"]');
        if (submitBtn) {
            e.preventDefault();
            handleSubmit(editor, root, submitBtn);
        } else if (insertBtn) {
            e.preventDefault();
            handleInsert(editor, root);
            modalObject.destroy();
        } else if (cancelBtn) {
            modalObject.destroy();
        }
    });
};

/**
 * Get the context to use in the modal template.
 *
 * @param {TinyMCE.editor} editor
 * @returns {Object}
 */
const getTemplateContext = (editor) => {

    return {
        elementid: editor.id,
    };
};

/**
 * Handle the submit action.
 *
 * @param {TinyMCE.editor} editor The tinyMCE editor instance.
 * @param {Object} root The root element of the modal.
 * @param {Object} submitBtn The submit button element.
 */
const handleSubmit = async(editor, root, submitBtn) => {
    // Display the loading spinner.
    displayLoading(editor.id, root, submitBtn);

    // Get the context id.
    const contextId = getContextId(editor);
    const promptText = root.querySelector('#' + editor.id + '_tiny_ai_prompttext').value;

    // Pass the prompt text to the webservice using Ajax.
    const request = {
        methodname: 'tiny_ai_generate_content',
        args: {
            contextid: contextId,
            prompttext: promptText,
        }
    };

    // Try making the ajax call and catch any errors.
    try {
        responseObj = await Ajax.call([request])[0];
        const generatedResponseEl = root.querySelector('#' + editor.id + '_tiny_ai_responsetext');
        const insertBtn = root.querySelector('[data-action="inserter"]');
        generatedResponseEl.value = responseObj.generatedcontent;
        generatedResponseEl.disabled = false;
        hideLoading(editor.id, root, submitBtn);
        insertBtn.classList.remove('hidden');

    } catch (error) {
        window.console.log(error);
        // TODO: Display error message in modal.
    }

};

/**
 * Display the loading action in the modal.
 *
 * @param {Integer} editorId The id of the editor.
 * @param {Object} root The root element of the modal.
 * @param {Object} submitBtn The submit button element.
 */
const displayLoading = (editorId, root, submitBtn) => {
    const loadingSpinnerDiv = root.querySelector('#' + editorId + "_tiny_ai_spinner");
    const overlayDiv = root.querySelector('#' + editorId + '_tiny_ai_overlay');
    const blurDiv = root.querySelector('#' + editorId + '_tiny_ai_blur');

    loadingSpinnerDiv.classList.remove('hidden');
    overlayDiv.classList.remove('hidden');
    blurDiv.classList.add('tiny-ai-blur');
    submitBtn.innerHTML = 'Generating...';
    submitBtn.disabled = true;
};

/**
 * Hide the loading action in the modal.
 *
 * @param {Integer} editorId The id of the editor.
 * @param {Object} root The root element of the modal.
 * @param {Object} submitBtn The submit button element.
 */
const hideLoading = (editorId, root, submitBtn) => {
    const loadingSpinnerDiv = root.querySelector('#' + editorId + "_tiny_ai_spinner");
    const overlayDiv = root.querySelector('#' + editorId + '_tiny_ai_overlay');
    const blurDiv = root.querySelector('#' + editorId + '_tiny_ai_blur');

    loadingSpinnerDiv.classList.add('hidden');
    overlayDiv.classList.add('hidden');
    blurDiv.classList.remove('tiny-ai-blur');
    submitBtn.innerHTML = 'Regenerate';
    submitBtn.disabled = false;
};

/**
 * Handle the insert action.
 *
 * @param {TinyMCE.editor} editor The tinyMCE editor instance.
 * @param {Object} root The root element of the modal.
 */
const handleInsert = async(editor, root) => {
    // Update the generated response with the content from the form.
    // In case the user has edited the response.
    const generatedResponseEl = root.querySelector('#' + editor.id + '_tiny_ai_responsetext');

    // Wrap the edited sections in the response with tags.
    // This is so we can differentiate between the edited sections and the generated content.
    const wrappedEditedResponse = await wrapEditedSections(responseObj.generatedcontent, generatedResponseEl.value);

    // Replace double line breaks with </p><p> for paragraphs
    const textWithParagraphs = wrappedEditedResponse.replace(/\n{2,}/g, '</p><p>');

    // Replace remaining single line breaks with <br> tags
    const textWithBreaks = textWithParagraphs.replace(/\n/g, '<br>');

    // Add opening and closing <p> tags to wrap the entire content
    responseObj.generatedcontent = `<p>${textWithBreaks}</p>`;

    // Generate the HTML for the response.
    const formattedResponse = await Templates.render('tiny_ai/insert', responseObj);

    // Insert the response into the editor.
    editor.insertContent(formattedResponse);
    editor.execCommand('mceRepaint');
    editor.windowManager.close();
};
