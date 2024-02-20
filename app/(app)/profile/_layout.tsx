import { View, Text, Button } from '@/components/Themed';
import TopBarNavigator from '@/components/TopBarNavigator';
import { AuthContext } from '@/context/authContext/AuthContext';
import { useContext } from 'react';

const profile = () => {

    const { logout, user } = useContext( AuthContext )

    const handleLogout = () => {
        logout();
    }

    return (
        <View>
            <TopBarNavigator />
            <View style={{marginTop: 100, width:'100%'}}>
                <Button style={{width:'50%'}} onPress={handleLogout}>
                    <Text>Logout</Text>
                </Button>
            </View>
        </View>
    );
};

export default profile;