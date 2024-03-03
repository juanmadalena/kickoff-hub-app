import { Text as DefaultText, View as DefaultView, useColorScheme, TextInput as DefaultTextInput, TouchableOpacity as DefaultTouchableOpacity, ActivityIndicator, Animated, NativeSyntheticEvent, TextInputChangeEventData  } from 'react-native';

import Colors from '@/constants/Colors';
import useTranslatePosition from '@/hooks/useTranslatePosition';
import { useEffect } from 'react';

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'] & { innerRef?: any };
export type TextInputProps = ThemeProps & DefaultTextInput['props'] & { innerRef?: any, error?: boolean, containerStyle?:  DefaultView['props']['style'] };
export type ButtonProps = ThemeProps & DefaultTouchableOpacity['props'] & { loading?: boolean };;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, innerRef, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView ref={innerRef} style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Button(props: ButtonProps ) {
  const { loading, disabled, lightColor, darkColor, style, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'primaryColor');
  const loadingColor = 'rgba(0, 91, 65,0.4)'

  return <DefaultTouchableOpacity disabled={disabled} style={[{borderRadius: 5, height: 50, padding:10, alignItems:'center', justifyContent:'center', backgroundColor: loading ? loadingColor : backgroundColor}, style]} {...otherProps}>
    {
      loading ? 
      <ActivityIndicator color="white"/>
      :
      props.children
    }
  </DefaultTouchableOpacity>
}

export function TextInput(props: TextInputProps) {
  const { error, style, lightColor, darkColor, containerStyle, innerRef = null, value = '', ...otherProps } = props;
  //colors
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'itemBackground');
  const primaryColor = useThemeColor({}, 'primaryColor');

  //error style
  const errorStyle = error ? {borderColor: 'red', borderWidth:1} : {};

  //animation
  const { position, animationIn, animationOut } = useTranslatePosition(props.value ? 0 : 40);
    
    useEffect(() => {
      if(value.length > 0){
        animationIn();
      }
      return () => {
        animationOut();
      }
    }, [value])

  return(
    <DefaultView style={[{marginBottom: 4, width:'100%'}, containerStyle]}>
      <Animated.Text style={{fontSize: 14, fontWeight:'500', marginBottom: 2, marginLeft:1, opacity: 0.5, color, transform:[{translateY:position}]}}>{props.placeholder}</Animated.Text>
      <DefaultTextInput value={value} ref={innerRef} selectionColor={primaryColor} style={[{ color, backgroundColor, borderRadius: 6, height: 50, padding:10, fontSize:16 }, style, errorStyle]} underlineColorAndroid={'transparent'} placeholderTextColor={'grey'} {...otherProps} />
    </DefaultView>
  ) 
}