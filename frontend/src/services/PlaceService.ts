import api from './api';

export const PlaceService = {
  getPlaces: async (params: any) => {
    const res = await api.get('/places', { params });
    return res.data;
  },

  getPlaceById: async (id: string) => {
    const res = await api.get(`/places/${id}`);
    return res.data;
  },

  getReviews: async (placeId: string) => {
    const res = await api.get(`/reviews/place/${placeId}`);
    return res.data;
  },

  getMedia: async (placeId: string) => {
    const res = await api.get(`/media/place/${placeId}`);
    return res.data;
  },

  getUpcomingEvents: async (placeId: string) => {
    const res = await api.get('/visits/upcoming', { params: { placeId } });
    return res.data;
  },

  compareRides: async (origin: any, destination: any) => {
    const res = await api.post('/rides/compare', { origin, destination });
    return res.data;
  },

  getThreads: async (placeId: string) => {
    const res = await api.get(`/threads/place/${placeId}`);
    return res.data;
  }
};
