import { Action, ThunkAction } from '@reduxjs/toolkit'
import { collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore/lite'

import { RootState } from '..'
import { addNewEmptyNote, deleteNoteById, savingNewNote, setActiveNote, setNotes, setPhotosToActiveNote, setSaving, updateNote } from './journalSlice'
import { Note } from '../../journal/types'
import { FirebaseDB } from '../../firebase/config'
import { fileUpload, loadNotes } from '../../helpers'

export const startNewNote = (): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async(dispatch, getState) => {
    dispatch(savingNewNote());

    const { uid } = getState().auth;

    const newNote: Note = {
      title: '',
      body: '',
      date: new Date().getTime(),
      imageUrls: []
    }

    const newDoc = doc(collection(FirebaseDB, `${uid}/journal/notes`));

    await setDoc(newDoc, newNote);

    newNote.id = newDoc.id;

    dispatch(addNewEmptyNote(newNote));
    dispatch(setActiveNote(newNote));
  }
}

export const startUpdateNote = (note: Note): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async(dispatch, getState) => {
    dispatch(setSaving());

    const { uid } = getState().auth; 
    const { active } = getState().journal;
    const { id } = active;

    const updatedNote = {
      ...active,
      ...note,
    }

    console.log('updatednote', updatedNote);
    
    const document = doc(collection(FirebaseDB, `${uid}/journal/notes`), id);

    await updateDoc(document, updatedNote);

    dispatch(setActiveNote(updatedNote));
    dispatch(updateNote(updatedNote));
  }
}

export const startLoadingNotes = (): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async(dispatch, getState) => {
    const { uid } = getState().auth;
    const notes = await loadNotes(uid);
    dispatch(setNotes(notes));
  }
}

export const startUploadingFiles = (files:FileList): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async(dispatch) => {
    dispatch(setSaving());

    // await fileUpload(files[0]);
    const fileUploadPromises = [];
    for (const file of files) {
      fileUploadPromises.push(fileUpload(file));
    }
    
    const photosUrls  = await Promise.all(fileUploadPromises);

    console.log(photosUrls);
    dispatch(setPhotosToActiveNote(photosUrls));
  }
}

export const startDeletingNote = (): ThunkAction<void, RootState, unknown, Action<string>> => {
  return async(dispatch, getState) => {
    const { uid } = getState().auth;
    const { active:note } = getState().journal;

    const docRef = doc(FirebaseDB, `${uid}/journal/notes/${note.id}`);
    await deleteDoc(docRef);
    dispatch(deleteNoteById(note.id!));
  }
}
