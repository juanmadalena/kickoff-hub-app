import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

type MapProps = MapView['props'] & { markers?: any[] | undefined };

const Map = ( props: MapProps ) => {

    const { initialRegion, style, markers} = props;

    return (
        <MapView initialRegion={initialRegion} style={style ?? styles.defaultStyle} maxDelta={0.1} minDelta={0.01} mapType="standard" scrollEnabled={false}>
            {markers?.map( marker => (
                <Marker
                    key={marker.latitude + marker.longitude}
                    coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude
                    }}
                />
            ))}
        </MapView>
    );
};

const styles = StyleSheet.create({
    defaultStyle: {
        height: '100%',
        width: '100%',
        borderRadius: 12,
    }
});

export default Map;