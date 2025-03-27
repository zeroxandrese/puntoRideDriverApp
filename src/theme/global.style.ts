import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Dimensions, StyleSheet } from "react-native";


const heightWindow = Dimensions.get("window").height
const widthWindow = Dimensions.get("window").width

export const globalStyle = StyleSheet.create({
   ContainarCenter: {
      justifyContent: 'center',
      alignItems: 'center'
   },
   GlobalContainerCustom: {
      flex: 1,

   },
   ContainerFabRequestServiceScreen: {
      margin: 20,
      borderRadius: 16,
      backgroundColor: '#FFFFFF',
      //backgroundColor: '#FFBC07',
      elevation: 6,
      width: widthWindow * 0.8,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 12,
      height: heightWindow * 0.17
   },
   ContainarCenterWithBackgroundGenral: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#EDF9FD',
      flex: 1
   },
   ContainerInitialScreen: {
      backgroundColor: '#EDF9FD',
      marginTop: heightWindow * 0.15,
      flex: 1
   },
   StyleLogoPRLogin: {
      margin: 12,
      alignItems: 'center'
   },
   StyleTextInputLogin: {
      width: widthWindow * 0.9,
      margin: 10,
      paddingLeft: 16
   },
   StyleTextPhoneNumberLogin: {
      fontSize: 16,
      fontWeight: 'bold',
      lineHeight: 28
   },
   ContainerGlobalAlingCenter: {
      alignItems: 'center'
   },
   ContainerTextPhoneNumberLogin: {
      marginLeft: 20
   },
   ContainerSignWithApiLogin: {
      backgroundColor: '#FFBC07',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      flexGrow: 1,
      justifyContent: "center",
      paddingBottom: 100,
      marginTop: heightWindow * 0.08,
      alignItems: 'center'
   },
   TextStyleSignIngLogin: {
      fontSize: 16,
      textAlign: 'center',
      margin: 16,
      fontWeight: '500',
      lineHeight: 22,
      color: '#000000'
   },
   StyleFABLogin: {
      backgroundColor: '#4A4A4A',
      marginTop: heightWindow * 0.04,
      width: widthWindow * 0.3,
   },
   StyleFABRequestScreenTypes: {
      backgroundColor: '#4A4A4A',
      marginTop: heightWindow * 0.04,
      width: widthWindow * 0.3,
      flexDirection: 'column',
      marginHorizontal: 6,
      elevation: 8
   },
   StyleTextFABLogin: {
      color: '#FFFFFF'
   },
   StyleFABCodeValidation: {
      backgroundColor: '#FFBC07'
   },
   textInicio: {
      fontSize: 18,
      color: '#00000000',
      fontWeight: '400'
   },
   containerInput: {
      height: 56,
      width: 60,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#49454F',
      marginHorizontal: 5,
      flexDirection: 'row'
   },
   count: {
      fontSize: 22,
      fontWeight: '500',
      lineHeight: 28,
      color: '#000000'
   },
   inputEdad: {
      fontSize: 16,
      backgroundColor: '#FFFFFF',
      flex: 1,
      paddingHorizontal: 5,
      color: '#49454F',
      fontWeight: '400',
      lineHeight: 24,
      textAlign: 'center'
   },
   textInfo: {
      color: '#000000',
      fontSize: 26,
      fontWeight: '600',
      lineHeight: 32,
      marginTop: 40
   },
   textDescription: {
      color: '#000000',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      marginVertical: 16,
      marginHorizontal: 16
   },
   ContainerBarTop: { backgroundColor: '#FFBC07', height: 64, justifyContent: 'center', paddingHorizontal: 4, paddingVertical: 8 },
   textResend2: {
      color: '#AEAAAE',
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
      textAlign: 'center',
      textAlignVertical: 'center'
   },
   textResend: {
      color: '#7209B7',
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
      textAlign: 'center',
      textAlignVertical: 'center'
   },
   textDescription2: {
      color: '#000000',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      marginTop: 16,
      marginHorizontal: 16
   },
   textTitlePermissionScreen: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#333" },
   textDescriptionPermissionScreen: { fontSize: 16, marginBottom: 30, textAlign: "center", color: "#555" },
   containerCarLateral: { marginTop: heightWindow * 0.1 },
   map: {
      ...StyleSheet.absoluteFillObject
   },
   contentContainerBottomSheet: {
      flexGrow: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#EDF9FD',
      borderRadius: 12,
      paddingBottom: 16,
    },
   handleIndicatorStyleCustom: {
      backgroundColor: '#FEE9F3'
   },
   handleStyleCustom: { backgroundColor: '#FFBC07', borderTopStartRadius: 12, borderTopEndRadius: 12 },
   containerStyleRowBottomInput: {
      flexDirection: 'row',
      width: widthWindow * 0.85,
      height: 75,
      alignItems: 'center',
      justifyContent: 'center'
   },
   StyleTextDirectionInput: {
      flex: 1,
      marginLeft: 6,
      height: 28,
      borderRadius: 12
   },
   touchablePredictions: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      alignContent: 'center',
      justifyContent: 'center',
      width: widthWindow * 0.8,
      borderWidth: 0.1,
      elevation: 4,
      borderColor: '#4A4A4A',
      height: 40,
      zIndex: 99999,
      marginBottom: 4
   },
   textPredictions: {
      fontSize: 14,
      textAlign: 'center',
      color: '#49454F'
   },
   modalPredictionStyle: {
      marginTop: 10,
      width: widthWindow * 0.8,
      marginLeft: heightWindow * 0.045,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      position: 'relative',
      zIndex: 1,
   },
   TextStyleContainerFabRequestServiceScreen: {
      color: '#000000',
      fontWeight: '500',
      lineHeight: 24,
      fontSize: 16
   },
   styleFABConfirmRequestServiceScreen: {
      backgroundColor: '#FFBC07',
      borderRadius: 28,
      elevation: 8,
      marginVertical: 8,
      width: widthWindow * 0.7
   },
   BottomSheetScrollView: {
      flexGrow: 1,
      width: widthWindow,
      paddingBottom: 20
    },
   viewLineRequestServiceScreen: {
      width: 1, backgroundColor: '#000000', height: 16, marginLeft: widthWindow * 0.105
   }
});