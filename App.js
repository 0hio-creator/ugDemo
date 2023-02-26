import { StatusBar } from 'expo-status-bar';
import { 
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput 
} from 'react-native';
import React, { useState } from 'react';

const unsplashKey = "ENTER YOUR KEY HERE" // ENTER YOUR UNSPLASH KEY HERE
const unspashURL = "https://api.unsplash.com/search/photos/?client_id=" + unsplashKey

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;



export default  App = () =>  {

    const [currentPage, setCurrentPage] = useState(null) // current searched page
    const [numberOfPages, setNumberOfPages] = useState(null) // total number of pages of the current search
    const [pageResults, setPageResults] = useState([]) // returned data of the last searched page
    const [queryText, setQueryText] = useState("") // search query

    
    // query = query text of the search
    // page to retrieve images of  
    const searchForImages = async (query, retrievePage) => {

        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        try {
            let res = await fetch(unspashURL+"&query="+query+"&page="+(retrievePage||"1"), requestOptions)
            let json = await res.json();

            setNumberOfPages(json.total_pages)
            setPageResults(json.results)
            setCurrentPage(retrievePage)
        } catch(e) {
            console.log("error: " + e)
        }
       

    }

    return (
        <View style={styles.container}>

            {/*Search section*/}
            <Text style={styles.heading}>{"Search for an Image 🔎"}</Text>
            <View
                style={styles.textInputBox}
            >
                <TextInput
                    onChangeText={setQueryText}
                    value={queryText}
                    returnKeyType={"search"}
                    placeholder={"Enter your search terms here"}
                    onSubmitEditing={()=>{searchForImages(queryText, 1)}}
                />
            </View>

            {/*Nav between pages*/}
            {currentPage!=null&&<View style={styles.pageRow}>
                <TouchableOpacity 
                    style={{...styles.button, backgroundColor:currentPage>1?"blue":"#D4D4D4" }}
                    onPress={()=>{searchForImages(queryText, currentPage-1)}}
                    disabled={currentPage==1}
                >
                    <Text style={{color:currentPage>1?"white":"black"}}>Previous</Text>
                </TouchableOpacity>
                <Text>{ "Page " + currentPage + "/" + numberOfPages}</Text>
                <TouchableOpacity 
                    style={{...styles.buttonRight, backgroundColor:currentPage<numberOfPages?"blue":"#D4D4D4" }}
                    onPress={()=>{searchForImages(queryText, currentPage+1)}}
                    disabled={currentPage==numberOfPages}

                >
                    <Text style={{color:currentPage<numberOfPages?"white":"black"}}>Next</Text>
                </TouchableOpacity>
            </View>}

            {/*Photo display*/}

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
            >
            <View style={styles.columns}>
                {/*Even index images in the left column*/}
                <View style={{width:0.4*width}}>
                    {pageResults.filter((item, i)=>i%2==0).map((item, i)=> {
                        return (
                             <View
                                key={"photoEven"+i}
                             >
                                <Image 
                                    source={{
                                        uri:item.urls.small,
                                        cache:"force-cache"
                                    }}
                                    style={styles.imageBox}
                                />
                             </View>
                        )
                    })}
                </View>
                 <View style={{width:0.05*width}}/>

                {/*Odd index images in the right column*/}
                <View style={{width:0.4*width}}>
                    {pageResults.filter((item, i)=>i%2!=0).map((item, i)=> {
                        return (
                             <View
                                key={"photoOdd"+i}
                             >
                                <Image 
                                    source={{
                                        uri:item.urls.small,
                                        cache:"force-cache"
                                    }}
                                    style={styles.imageBox}
                                />
                             </View>
                        )
                    })}
                </View>
            </View>
            </ScrollView>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        //justifyContent: 'center',
    },
    heading:{
        marginTop:0.1*height,
        fontSize:20
    },
    textInputBox:{
        width:0.75*width,
        borderWidth:1,
        marginTop:0.02*height,
        paddingLeft:0.03*width,
        paddingVertical:0.01*height,
        marginBottom:0.02*height,
    },
    columns:{
        flexDirection:'row'
    },
    imageBox:{
        height:0.4*width, 
        width:0.4*width, 
        resizeMode:"contain"
    },
    button:{
        padding:0.02*width,
        marginRight:0.03*width
    },
    buttonRight:{
        padding:0.02*width,
        marginLeft:0.03*width
    },
    pageRow:{
       flexDirection:'row',
       alignItems:"center",
       marginBottom:0.01*height,
    },
    scrollContainer:{
        width:width,
        paddingBottom:0.1*height,
        alignItems:"center"
    }
});
