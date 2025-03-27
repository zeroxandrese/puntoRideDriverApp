import React, { useEffect, useRef, useMemo, useCallback, ReactElement } from 'react';
import { Keyboard, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Text } from 'react-native-paper';


 const BottomSheetMainHome = () => {
    const refSheetCommentsHome = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['90%'], []);

/*     useEffect(() => {

        if (isVisibleBttonSheetCommentsHome) {

            refSheetCommentsHome.current?.expand();
        } else {

            refSheetCommentsHome.current?.close();
        }
    }, [isVisibleBttonSheetCommentsHome]); */


    

    const renderBackdropHome = useCallback(
        (props: any) => <BottomSheetBackdrop {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            onPress={() => {
                refSheetCommentsHome.current?.close();
            }
            }
        />,
        []
    );

    useEffect(() => {
        setTimeout(() => {
          refSheetCommentsHome.current?.expand();
          console.log('paso por el timeout')
        }, 500); // Le damos un pequeño delay para que se renderice bien
      }, []);

/*     const closeBottomSheetMainHome = () => {
        if (isVisibleBttonSheetCommentsHome) {
            refSheetCommentsHome.current?.close();
        }
    }; */

    return (
        <BottomSheet
            ref={refSheetCommentsHome}
            snapPoints={snapPoints}
            index={0}
            enablePanDownToClose={true}
            keyboardBehavior="fillParent"
            backdropComponent={renderBackdropHome}
            style={{ zIndex: 100 }}
            detached={true}
            onClose={() => {
                Keyboard.dismiss();
            }
            }
        >
            <View>
            <Text>Prueba</Text>
            </View>
        </BottomSheet>
    );
};

export { BottomSheetMainHome };