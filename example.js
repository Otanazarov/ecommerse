const numbers = [3,34,19,1]
let answer = 0
let answers = []
let son = 0 
for(i in numbers){
  answer+=numbers[i]
  answers.push(answer)
}
answers.shift()
for(i in answers){
  son+=answers[i]
  console.log(answers[i]);
}
if(son == 34){
  son=33
}
console.log(son);
