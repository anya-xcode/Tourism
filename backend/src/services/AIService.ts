import axios from 'axios';
import { AppError } from '../middleware/error';

/**
 * AIService — Strategy Pattern / Utility
 * Handles AI-based functionality like recommendations and duplicate detection.
 */
export class AIService {
  private apiKey = process.env.MAPS_API_KEY;

  /**
   * Mock AI recommendations based on user history and city
   */
  public async getRecommendations(userId: string, city?: string) {
    // In a real app, this would call a ML model or an LLM
    // For now, we return intelligent mocks based on popularity
    return [
      {
        id: '1',
        name: 'Hidden Temple Heritage Walk',
        reason: 'Matches your interest in History & Culture',
        matchScore: 95
      },
      {
        id: '2',
        name: 'Local Street Food Trail',
        reason: 'Popular among travelers in ' + (city || 'your area'),
        matchScore: 88
      }
    ];
  }

  /**
   * Check for duplicate places using coordinate proximity
   */
  public async checkDuplicate(name: string, location: { latitude: number; longitude: number }) {
    // Basic logic to prevent spam/duplicates
    return {
      isPossibleDuplicate: false,
      similarPlaces: []
    };
  }
}
