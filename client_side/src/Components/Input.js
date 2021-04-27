import { Component, React } from 'react';

import Header from './Header';

// var temp="";

class Input extends Component{
    constructor(props){
        super(props);
        this.state = {code: 'code-area', output: '', needOutput: false, answer: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleOutput = this.handleOutput.bind(this);
        this.takeAnswer = this.takeAnswer.bind(this);
        // this.handleClick = this.handleSubmit.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount(){
        this.props.connection.onopen = () => {
            console.log('Connected to socket at 5000');
            this.props.connection.onmessage = (message) => {
                var data = JSON.parse(message.data);
                if(data.type === 'broadcast'){
                    this.setState({code: data.msg});
                }
                else if (data.type === 'serverResponse'){
                    var temp = this.state.output + data.name.client_code;
                    this.setState({output: temp, needOutput: data.needOutput.needOutput});
                }
                else if (data.type === 'clear'){
                    this.setState({output:''});
                }
                else if (data.type === 'answerBroadcast'){
                    this.setState({answer: data.msg})
                }
                else if (data.type === 'answer'){
                    var newout = this.state.output + data.msg;
                    // console.log(newout);
                    this.setState({output: newout, answer: ''});
                }
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({output: ''});
        this.props.connection.send(JSON.stringify({
            type: "message",
            msg: this.state.code,
            newCode: true 
        }));
    
    }

    handleChange = (e) => {
        this.setState({code: e.target.value},() =>{
            this.props.connection.send(JSON.stringify({
                type: "broadcast",
                msg: this.state.code
            }));
        });

    }

    handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
            var temp = this.state.output + this.state.answer + '\n';
            console.log(this.state.output);
            this.setState({output: temp});
            console.log(this.state.answer);
            this.props.connection.send(JSON.stringify({
                type: "answer",
                msg: this.state.answer + '\n',
                newCode: false
            }))
            this.setState({answer: ''});
        }
        
    }

    // handleOutput = (e) => {
    //     e.preventDefault();
    //     // const temp = this.state.output;
    //     this.setState({output: e.target.value});
    //     // console.log(e.)
    // }

    takeAnswer = (e) => {
        this.setState({answer: e.target.value}, () =>{
            this.props.connection.send(JSON.stringify({
                type: "answerBroadcast",
                msg: this.state.answer
            }));
        });
    }
    

    render(){
        return(
             <div>
            <Header />

            <form onSubmit= {this.handleSubmit}>
                <textarea 
                    id='code' 
                    required
                    value = {this.state.code} 
                    rows='25' 
                    cols='100'
                    onChange = {this.handleChange}
                />
                <p>{"\n"}</p>
                <button> Run </button>

            </form>
            <textarea 
                id='output' 
                value= {this.state.output}
                placeholder="Output will be shown here"
                rows='10' 
                cols='100'
                readOnly
            /> 
            <p>{"\n"}</p>
            {this.state.needOutput && <textarea 
                id='answer' 
                value= {this.state.answer}
                rows='2' 
                cols='50'
                placeholder="Type Input Here. Press 'Enter' to submit input"
                onChange={this.takeAnswer}
                onKeyDown={this.handleKeyDown}
            /> }
        </div>
        )
    }
}


//         // fetch('http://localhost:5000/backend', {
//         //     method: 'POST',
//         //     headers: { "Content-Type": "application/json"},
//         //     body: JSON.stringify(req_body)
//         // })
//         // .then(res => {
//         //     console.log(res);
//         //     return res.json();
//         // })
//         // .then(data => {
//         //     setOutput(data.name);
//         // })
//     }




export default Input;