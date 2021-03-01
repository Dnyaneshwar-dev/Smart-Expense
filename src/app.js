App = {
  loading: false,
  contracts: {},
  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        await ethereum.enable()
        web3.eth.sendTransaction({/* ... */ })
      } catch (error) {
      }
    }
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      web3.eth.sendTransaction({/* ... */ })
    }
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
    const list = await $.getJSON('smartexpense.json')
    App.contracts.smartexpense = TruffleContract(list)
    App.contracts.smartexpense.setProvider(App.web3Provider)

    App.appVariable = await App.contracts.smartexpense.deployed()
  },
  renderTasks: async () => {
    // Load the total task count from the blockchain
    const taskCount = await App.appVariable.taskCount()
    const total = await App.appVariable.total()
    console.log(total.toNumber())
    $('.mon').text(total)
    
    const $transaction = $('.taskTemplate')
    // const $tot = $('.totalCost')
    // const $showAmount = $tot.clone()
    // $showAmount.find('.mon').html(total)
    // $showAmount.show()
    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.appVariable.tasks(i)
      const taskId = task[0].toNumber()
      const taskCost = task[1].toNumber()
      const taskDetails = task[2]
      console.log(taskCost)
      console.log(taskDetails)
      // Create the html for the task
      const $newTransaction = $transaction.clone()
      $newTransaction.find('.content').html(taskDetails)
      $newTransaction.find('.amount').html(taskCost)
      $("#taskList").append($newTransaction)
      // Show the task

      $newTransaction.show()                                                                                                                                                                                                                                                                                         
    }
  },

  createTask: async () => {
    App.setLoading(true)
    const cost = $('#cost').val()
    const detail = $("#detail").val()
    await App.appVariable.createTask(cost,detail)
    window.location.reload()
    
  },
  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },
  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})