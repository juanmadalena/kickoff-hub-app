import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions, MaterialTopTabNavigationEventMap } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import TopTab from '@/components/TopTabs';
import useNotifications from '@/hooks/useNotifications';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabNavigator = withLayoutContext<
    MaterialTopTabNavigationOptions, 
    typeof Navigator, 
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
    >(Navigator);

const TabsLayout = () => {

    useNotifications();

    return (
        <MaterialTopTabNavigator
            initialRouteName="matchesAvailable"
            tabBar={props => <TopTab {...props} />}
            style={{marginTop:6}}
            screenOptions={{
                lazy: true,
            }}
        >
            <MaterialTopTabNavigator.Screen name="index" options={{ title: 'Matches' }}/>
            <MaterialTopTabNavigator.Screen name="matchesOrganized" options={{ title: 'Organized' }} />
            <MaterialTopTabNavigator.Screen name="matchesHistory" options={{ title: 'History' }} />
        </MaterialTopTabNavigator>
    );
};

export default TabsLayout;