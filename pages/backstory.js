import React, { useState } from 'react';
import Link from 'next/link';

import Layout from '../components/Layout';
import { Action, FormDisplay, StoryDisplay, ButtonDisplay, FlexRow } from '../styles/globals'

import store from '../redux/store';
import { Provider } from 'react-redux';
import { useDispatch } from 'react-redux';
import { writeSubclass } from '../redux/actions'

const testText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in risus ac libero dapibus viverra. Fusce pulvinar risus orci, at elementum ligula pellentesque vel. Aliquam rhoncus mauris quis tortor lobortis, sed pretium lorem laoreet. Aenean mollis lacinia mauris, vitae viverra orci hendrerit vitae. Maecenas eu iaculis magna. Cras scelerisque sed augue vel iaculis. Integer in porta odio, commodo mattis elit. Donec non odio cursus, dignissim mauris at, ornare enim.Aenean in ante eget lectus egestas porttitor sed at felis.Nullam ornare, libero vel congue pellentesque, lacus elit sagittis eros, fermentum blandit quam turpis in libero.Integer in nibh enim.Quisque vulputate imperdiet tortor, ut faucibus lorem suscipit nec.Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.Vivamus sodales iaculis lorem in euismod.Duis vel tristique mi.Vivamus et consectetur nisl, eget gravida nibh. Sed semper lacus purus, eget fermentum elit pulvinar sed.Nam condimentum magna eget augue aliquet, eu iaculis eros aliquam.Donec posuere posuere libero in pulvinar.Vestibulum sodales nec libero sit amet gravida.Interdum et malesuada fames ac ante ipsum primis in faucibus.Aliquam mauris ante, gravida ut erat cursus, mattis ullamcorper felis.Vivamus et laoreet eros.Proin ultricies augue eu risus maximus, at ultrices diam pretium.Vivamus congue sem lectus, id vestibulum diam pellentesque at.Duis ultricies tempor interdum.Duis euismod sapien vitae euismod feugiat.Fusce nec dolor tempor, vestibulum augue non, consequat dui.Proin dui augue, aliquam et feugiat at, sagittis pulvinar orci. Vestibulum molestie tincidunt dui euismod mattis.Aliquam egestas eget mauris non vehicula.Ut dolor elit, varius vitae nisi in, ultricies tristique erat.Morbi ut leo nec ipsum pulvinar molestie ac et turpis.Sed hendrerit finibus dolor, porttitor mollis massa viverra id.Duis posuere sollicitudin semper.Fusce nec magna porta, sollicitudin quam nec, hendrerit enim.Aliquam commodo eleifend magna, at mattis velit pharetra in. Vestibulum eu iaculis tellus.Nam eget erat hendrerit, vehicula odio vel, hendrerit dui.Sed ac diam placerat, imperdiet ex vitae, eleifend tortor.Praesent ultricies ex turpis, a pretium nisl convallis vel.Nunc nec leo eros.Maecenas nec laoreet diam.Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.Aliquam erat volutpat.Maecenas vel commodo ex.Quisque porttitor diam nec odio tincidunt tincidunt."

function TestStore() {
    const dispatch = useDispatch();
    dispatch(writeSubclass("--- changed value ---"))
    return 0;
}

function handleSubmit() {
    alert("OpenAI call here")

}

export default function Backstory() {

    var test = TestStore()
    const [toggle, setToggle] = useState(false)
    const [userInput, setUserInput] = useState("")

        return (
            <Layout>
                <FormDisplay>
                    <form onSubmit={(e) => {
                        if (userInput === '') {
                            e.preventDefault()
                            alert("You must enter a description of your character before proceeding.")
                        }
                        else {
                            e.preventDefault();
                            handleSubmit();
                            setToggle(true)
                        }

                    }}>
                        <input value={userInput} placeholder="Enter a description of your character's story" onChange={(e) => setUserInput(e.target.value)} />
                        <button>Submit</button>
                    </form>
                    {toggle ?
                        //stuff
                            <StoryDisplay>
                                <p>{testText}{testText}</p>
                            </StoryDisplay>
                        :
                        <></>
                        }
                </FormDisplay>
                {toggle ?
                    <ButtonDisplay>
                        <Link href="/review">
                            <Action>Continue</Action>
                        </Link>
                    
                        <Link href="/">
                            <Action>Go Back</Action>
                        </Link>
                    </ButtonDisplay>
                    :
                    <></>
                }
            </Layout>
        )
    }