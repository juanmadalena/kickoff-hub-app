import { View, StyleSheet, ActivityIndicator } from 'react-native';

type props = ActivityIndicator['props']

const LoadingComponent = ( props : props) => {

    const { size = 'large', color = 'grey', ...otherProps } = props;

    return (
        <View style={[styles.container]}>
            <ActivityIndicator size={size} color={color} {...otherProps} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default LoadingComponent;