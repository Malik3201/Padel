import React, { useState } from 'react';
import { X, Trophy, Calendar, MapPin, DollarSign } from 'lucide-react';

const AddTournamentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerTeam: '',
    playerLevel: 'beginner',
    prizeWinner: '',
    prizeRunnerUp: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    // Fix: onSubmit is called with formData, not event
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        name: '',
        description: '',
        pricePerTeam: '',
        playerLevel: 'beginner',
        prizeWinner: '',
        prizeRunnerUp: ''
      });
    } catch (error) {
      console.error('Error creating tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto border border-slate-700">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-bold text-white">Add New Tournament</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Tournament Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Trophy className="w-4 h-4 inline mr-1" />
              Tournament Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tournament description..."
              rows="3"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Price per Team */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Price per Team
            </label>
            <input
              type="number"
              name="pricePerTeam"
              value={formData.pricePerTeam}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Player Level */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Player Level
            </label>
            <select
              name="playerLevel"
              value={formData.playerLevel}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner" className="bg-slate-700">Beginner</option>
              <option value="intermediate" className="bg-slate-700">Intermediate</option>
              <option value="advanced" className="bg-slate-700">Advanced</option>
            </select>
          </div>

          {/* Prize Winner */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Prize Winner
            </label>
            <input
              type="number"
              name="prizeWinner"
              value={formData.prizeWinner}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              placeholder="Prize amount for winner"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Prize Runner Up */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Prize Runner Up
            </label>
            <input
              type="number"
              name="prizeRunnerUp"
              value={formData.prizeRunnerUp}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              placeholder="Prize amount for runner up"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Tournament'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTournamentModal;
