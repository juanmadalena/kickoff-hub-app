import { Text as DefaultText, View as DefaultView, useColorScheme, TextInput as DefaultTextInput, TouchableOpacity as DefaultTouchableOpacity, ActivityIndicator  } from 'react-native';

import Colors from '@/constants/Colors';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type TextInputProps = ThemeProps & DefaultTextInput['props'] & { innerRef?: any, error?: boolean};
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
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
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
  const { error, style, lightColor, darkColor, innerRef = null, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'itemBackground');
  const errorStyle = error ? {borderColor: 'red', borderWidth:1} : {};

  return <DefaultTextInput ref={innerRef} style={[{ color, backgroundColor, borderRadius: 5, height: 50, padding:10, fontSize:16, marginBottom: 15 }, style, errorStyle]} underlineColorAndroid={'transparent'} placeholderTextColor={'grey'} {...otherProps} />
}