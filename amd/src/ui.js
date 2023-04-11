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

    const loadingSpinnerDiv = root.querySelector('#' + editor.id + "_tiny_ai_spinner");
    const overlayDiv = root.querySelector('#' + editor.id + '_tiny_ai_overlay');
    const blurDiv = root.querySelector('#' + editor.id + '_tiny_ai_blur');
    const currentForm = root.querySelector('form');

    modalObject.show();
    modalroot.on(ModalEvents.hidden, () => {
        modalObject.destroy();
    });

    root.addEventListener('click', (e) => {
        const submitAction = e.target.closest('[data-action="generate"]');
        if (submitAction) {
            e.preventDefault();
            loadingSpinnerDiv.classList.remove('hidden');
            overlayDiv.classList.remove('hidden');
            blurDiv.classList.add('tiny-ai-blur');
            submitAction.value = 'Generating...';
            submitAction.disabled = true;
            window.console.log(currentForm);
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
