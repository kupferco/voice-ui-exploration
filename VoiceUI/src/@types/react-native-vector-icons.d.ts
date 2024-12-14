declare module 'react-native-vector-icons/Ionicons' {
    import React from 'react';
    import { TextProps } from 'react-native';
  
    export interface IoniconsProps extends TextProps {
      name: string; // Icon name
      size?: number; // Icon size
      color?: string; // Icon color
    }
  
    const Ionicons: React.ComponentType<IoniconsProps>;
  
    export default Ionicons;
  }
  