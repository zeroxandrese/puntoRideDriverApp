import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Dimensions, StyleSheet } from "react-native";


const heightWindow = Dimensions.get("window").height
const widthWindow = Dimensions.get("window").width

export const globalStyle = StyleSheet.create({
   containerLogin: {
      flex: 1,
      backgroundColor: '#FFBC07',
      justifyContent: 'center',
      alignItems: 'center'
   },
   cardLogin: {
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 25,
      width: '100%',
      elevation: 5,
   },
   titleLogin: {
      fontSize: 24,
      color: '#000000',
      fontWeight: 'bold',
      marginBottom: 25,
      textAlign: 'center',
   },
   inputLogin: {
      backgroundColor: '#F1F1F1',
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 12,
      fontSize: 16,
      marginBottom: 15,
   },
   buttonLogin: {
      backgroundColor: '#FFBC07',
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 40
   },
   buttonTextLogin: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
   },
   registerTextLogin: {
      marginTop: 15,
      fontSize: 18,
      textAlign: 'center',
      color: '#000',
   },
   linkLogin: {
      color: '#FFBC07',
      fontSize: 16,
      fontWeight: 'bold',
   },
   modalRegisterLogin: {
      backgroundColor: "#fff",
      width: "100%",
      borderRadius: 30,
      height: heightWindow * 0.7,
      padding: 20
   },
   containerContactUs: {
      flex: 1,
      backgroundColor: '#EDF9FD',
   },
   containerContactUsChildren: {
      padding: 20,
      marginTop: heightWindow * 0.01,
      backgroundColor: '#EDF9FD',
   },
   inputContactUs: {
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
      padding: 12,
      borderRadius: 8,
      textAlignVertical: 'top',
      marginBottom: 20,
   },
   titleContactUs: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#333',
      textAlign: 'center'
   },
   subtitleContactUs: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
      color: '#555',
   },
   cardHistoryTrip: {
      backgroundColor: '#FFFFFF',
      borderColor: '#FFBC07',
      borderWidth: 1,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
   },
   containerHistory: {
      flex: 1,
      backgroundColor: '#EDF9FD',
      marginBottom: 20
   },
   containerHistoryChildren: {
      padding: 20,
      marginTop: heightWindow * 0.01,
      backgroundColor: '#EDF9FD',
      marginBottom: 20
   },
   statusCardHistoryTrip: {
      marginTop: 8,
      color: '#27AE60'
   },
   subtitleHistory: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
      color: '#555',
   },
   containerNoHistory: {
      justifyContent: 'center',
      alignItems: 'center',
      height: heightWindow * 0.4
   },
   bold: {
      fontWeight: '600',
      color: '#7F8C8D'
   },
   boldPrice: {
      fontWeight: '500',
      color: '#27AE60',
   },
   route: {
      fontSize: 14,
      marginBottom: 4,
      color: '#333',
      fontWeight: 'bold'
   },
   date: {
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#444',
   },
   headerLine: {
      height: 4,
      width: widthWindow * 0.6,
      backgroundColor: '#FFBC07',
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 20,
   },
   headerNameMenu: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 30,
      color: '#333',
      alignSelf: 'center',
      marginTop: 8,
   },
   ContainerGlobalAlingCenter: {
      alignItems: 'center'
   },
   map: {
      ...StyleSheet.absoluteFillObject,
      flex: 1
   },
   GlobalContainerCustom: {
      flex: 1
   },
   handleIndicatorStyleCustom: {
      backgroundColor: '#FEE9F3'
   },
   handleStyleCustom: { backgroundColor: '#FFBC07', borderTopStartRadius: 12, borderTopEndRadius: 12 },
   cancelModalView: {
      position: 'absolute',
      flexDirection: 'row',
      top: 10,
      left: 20,
      right: 20,
      backgroundColor: '#EDF9FD',
      padding: 20,
      borderRadius: 12,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      zIndex: 100,
   },
   titleCancelView: {
      fontSize: 16,
      fontWeight: "500",
      color: '#7F8C8D'
   },
   icon: {
      marginRight: 12,
   },
   menuText: {
      fontSize: 16,
      color: '#333',
      fontWeight: '500',
   },
   headerMenu: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      alignSelf: 'center',
      marginTop: heightWindow * 0.07,
   },
   divider: {
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      marginVertical: 20,
   },
   modalContainerMenuChildren: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '75%',
      backgroundColor: '#EDF9FD',
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20
   },
   menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20,
   },
   styleProgressBar: {
      height: 10, borderRadius: 6, width: widthWindow * 0.85
   },
   textTitleCurrentTrip: {
      color: '#000000',
      fontWeight: 'bold',
      lineHeight: 24,
      fontSize: 18
   },
   timerContainer: {
      marginTop: 16,
      alignItems: 'center',
   },
   timerText: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#4CAF50',
      backgroundColor: '#ffffff',
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
   },
   imgAvatarCarts: {
      width: 65,
      height: 65,
      borderRadius: 30,
      marginRight: 16,
      marginTop: 4
   },
   subtitleCurrentTrip: {
      fontSize: 14,
      marginVertical: 16,
      textAlign: 'center',
      color: '#555'
   },
   count: {
      fontSize: 22,
      fontWeight: '500',
      lineHeight: 28,
      color: '#000000'
   },
   containerInputCurrentTrip: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderTopWidth: 1,
      borderColor: '#ddd',
      backgroundColor: '#FFF',
   },
   labelVehicleCurrentTrip: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 4,
   },
   valueVehicleCurrentTrip: {
      fontSize: 16,
      color: "#333",
      flexWrap: 'wrap',
   },
   sectionTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 8,
      color: '#222',
      textAlign: 'center'
   },
   inputComments: {
      flex: 1,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 10,
   },
   containerCard: {
      width: widthWindow * 0.9,
      marginVertical: 12,
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 20,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6
   },
   row: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 10,
   },
   label: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      width: "30%",
   },
   value: {
      fontSize: 16,
      color: "#666",
      flexShrink: 1,
      flexWrap: "wrap",
      maxWidth: "65%",
   },
   ContainarCenterWithBackgroundGenral: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#EDF9FD',
      flex: 1
   },
   textTitlePermissionScreen: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#333" },
   textDescriptionPermissionScreen: { fontSize: 16, marginBottom: 30, textAlign: "center", color: "#555" }
});