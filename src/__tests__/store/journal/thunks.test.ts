import { collection, deleteDoc, getDocs } from 'firebase/firestore/lite';
import { addNewEmptyNote, savingNewNote, setActiveNote } from '../../../store/journal/journalSlice';
import { startNewNote } from '../../../store/journal/thunks';
import { FirebaseDB } from '../../../firebase/config';

describe('Tests on journal thunks', () => {
  describe('#startNewNote', () => {
    const dispatch = vi.fn();
    const getState = vi.fn();
    const extraArgument = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    })


    test('should create a new empty note', async() => {
      const uid = 'TEST-UID';
      const note = {
        body: '',
        title: '',
        id: expect.any(String),
        date: expect.any(Number),
        imageUrls: [],
      }

      vi.mocked(getState).mockReturnValue({ auth: { uid }});

      await startNewNote()(dispatch, getState, extraArgument);

      expect(dispatch).toHaveBeenCalledWith(savingNewNote());
      expect(dispatch).toHaveBeenCalledWith(addNewEmptyNote({...note}));
      expect(dispatch).toHaveBeenCalledWith(setActiveNote({...note}));
      expect(dispatch).toHaveBeenCalledTimes(3);

      // Clear firebase
      const collectionRef = collection(FirebaseDB, `${uid}/journal/notes`);
      const docs = await getDocs(collectionRef);
      const deletePromises: Promise<void>[] = [];
      docs.forEach(doc => deletePromises.push(deleteDoc(doc.ref)));

      await Promise.all(deletePromises);
    });
  });
});
