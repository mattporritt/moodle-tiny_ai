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
        if (submitBtn) {
            e.preventDefault();
            handleSubmit(editor.id, root, submitBtn);
            // TODO: Destroy the modal and call the AI service.
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
 * @param {Integer} editorId The id of the editor.
 * @param {Object} root The root element of the modal.
 * @param {Object} submitBtn The submit button element.
 */
const handleSubmit = (editorId, root, submitBtn) => {
    // Display the loading spinner.
    displayLoading(editorId, root, submitBtn);

    // Get the context id.
    const contextId = getContextId(editorId);

    // Pass the prompt text to the webservice using Ajax.
    const request = {
        methodname: 'tiny_ai_generate',
        args: {
            contextid: contextId,
            prompttext: 'This is a test prompt',
        }
    };

    Ajax.call([request])[0].then((response) => {

    }).catch((error) => {
        
    });
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
    const currentForm = root.querySelector('form');

    loadingSpinnerDiv.classList.remove('hidden');
    overlayDiv.classList.remove('hidden');
    blurDiv.classList.add('tiny-ai-blur');
    submitBtn.innerHTML = 'Generating...';
    submitBtn.disabled = true;
    window.console.log(currentForm);
};
