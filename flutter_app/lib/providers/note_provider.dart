import 'package:flutter/foundation.dart';
import '../models/note.dart';
import '../services/note_service.dart';

class NoteProvider extends ChangeNotifier {
  List<Note> _notes = [];
  Note? _currentNote;
  bool _isLoading = false;
  String? _error;

  List<Note> get notes => _notes;
  Note? get currentNote => _currentNote;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Load notes
  Future<void> loadNotes({int? categoryId}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _notes = await NoteService.getNotes(categoryId: categoryId);
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Load note by ID
  Future<void> loadNoteById(int id) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _currentNote = await NoteService.getNoteById(id);
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Create note
  Future<bool> createNote(NoteCreateRequest request) async {
    _error = null;
    try {
      final note = await NoteService.createNote(request);
      _notes.insert(0, note);
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // Update note
  Future<bool> updateNote(int id, NoteCreateRequest request) async {
    _error = null;
    try {
      final updatedNote = await NoteService.updateNote(id, request);
      final index = _notes.indexWhere((n) => n.noteId == id);
      if (index != -1) {
        _notes[index] = updatedNote;
      }
      if (_currentNote?.noteId == id) {
        _currentNote = updatedNote;
      }
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // Delete note
  Future<bool> deleteNote(int id) async {
    _error = null;
    try {
      await NoteService.deleteNote(id);
      _notes.removeWhere((n) => n.noteId == id);
      if (_currentNote?.noteId == id) {
        _currentNote = null;
      }
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // Clear current note
  void clearCurrentNote() {
    _currentNote = null;
    notifyListeners();
  }

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
