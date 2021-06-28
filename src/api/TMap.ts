import TMapRequest from '@/utils/TMapRequest';

export const getLocation = () =>
  TMapRequest({
    url: '/ws/location/v1/ip',
  });
type GeocoderByAddressRes = {
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
export const getGeocoderByAddress = (address: string) =>
  TMapRequest<GeocoderByAddressRes>({
    url: '/ws/geocoder/v1/',
    data: {
      address,
    },
  });
type GeocoderByLocationRes = {
  status: number;
  message: string;
  result: {
    location: {
      lat: number;
      lng: number;
    };
    address: string;
    formatted_addresses: {
      recommend: string;
      rough: string;
    };
    address_component: {
      nation: string;
      province: string;
      city: string;
      district: string;
      street: string;
      street_number: string;
    };
  };
};
export const getGeocoderByLocation = (lat, lng) =>
  TMapRequest<GeocoderByLocationRes>({
    url: '/ws/geocoder/v1/',
    data: {
      location: `${lat},${lng}`,
      poi_options: 'policy=2',
    },
  });
