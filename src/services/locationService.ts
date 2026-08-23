import * as Location from 'expo-location';

export interface RealtimeLocationResult {
  city: string;
  district?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export class LocationService {
  /**
   * Request GPS permission and fetch live device location
   */
  static async getCurrentLocation(): Promise<RealtimeLocationResult> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission was denied. Please allow GPS access in settings.');
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get city / locality name
      let city = 'Delhi';
      let district = '';
      let state = 'Delhi';
      let country = 'India';
      let postalCode = '';
      let formattedAddress = 'Delhi, India';

      try {
        const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (addresses && addresses.length > 0) {
          const addr = addresses[0];
          city = addr.city || addr.subregion || addr.region || 'Delhi';
          district = addr.district || addr.name || '';
          state = addr.region || addr.subregion || 'Delhi';
          country = addr.country || 'India';
          postalCode = addr.postalCode || '';

          const parts = [district, city, state].filter(Boolean);
          formattedAddress = parts.join(', ');
        }
      } catch (geocodeErr) {
        // Fallback to coordinates
        formattedAddress = `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`;
      }

      return {
        city: city.toLowerCase(),
        district,
        state,
        country,
        postalCode,
        latitude,
        longitude,
        formattedAddress,
      };
    } catch (err: any) {
      throw new Error(err.message || 'Unable to retrieve GPS location');
    }
  }
}
