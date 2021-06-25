import TMapRequest from '@/utils/TMapRequest';

export const getLocation = () =>
  TMapRequest({
    url: '/ws/location/v1/ip',
  });
type GeocoderRes = {
  status: number;
  message: string;
  result: {
    title: string;
    location: {
      lng: number;
      lat: number;
    };
    ad_info: {
      adcode: number;
    };
    address_components: {
      province: string;
      city: string;
      district: string;
      street: string;
      street_number: string;
    };
    similarity: number;
    deviation: number;
    reliability: number;
    level: number;
  };
};
export const getGeocoder = (address: string) =>
  TMapRequest<GeocoderRes>({
    url: '/ws/geocoder/v1/',
    data: {
      address,
    },
  });
