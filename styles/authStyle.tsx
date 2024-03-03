import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
    container:{
        flex: 1, 
        paddingHorizontal:20
    },
    innerContainer:{
        flex: 1, 
        justifyContent: 'space-around'
    },
    titleContainer:{
        marginBottom:20, 
        height:70, 
        minHeight:70, 
        justifyContent:'center'
    },
    title:{
        fontSize: 30, 
        fontWeight: '500'
    },
    formContainer:{
        width:'100%', 
        paddingBottom:20, 
        height:'80%'
    },
    subtitle:{
        color: 'grey', 
        fontSize: 16
    },
    buttonText: {
        color:'white', 
        fontWeight:'600', 
        fontSize:16
    }
});
