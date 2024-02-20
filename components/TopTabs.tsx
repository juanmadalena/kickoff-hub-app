import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { View, useThemeColor } from '@/components/Themed';


const TopTab = ({ state, descriptors, navigation, position }: MaterialTopTabBarProps) => {

  const background = useThemeColor({}, 'itemBackground');
  const activeColor = useThemeColor({}, 'selectionBackground');
  const textColor = useThemeColor({}, 'text');

  return (
    <View  style={[styles.container, {backgroundColor: background}]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const label = descriptors[route.key].options.title

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_, i) => i);

        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0.4)),
        });

        return (
        
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, justifyContent:'center', alignItems:'center'}}
          >
            <Animated.View style={{backgroundColor: activeColor, padding: 12, borderRadius:12, opacity, width:'95%', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                <Animated.Text style={{ opacity, fontSize:14, color: textColor, fontWeight:'600', textAlign:'center' }}>
                    {label}
                </Animated.Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row', 
    height:60, 
    borderRadius:18, 
    marginHorizontal:12, 
    marginBottom:8, 
    paddingHorizontal:6,
    backgroundColor:'#111111'
  }

})

export default TopTab;