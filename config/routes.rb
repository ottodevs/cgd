Rails.application.routes.draw do
  resources :cryptos
  root 'cryptos#index'

  # Serve websocket cable requests in-process
  mount ActionCable.server => 'wss://api.bitfinex.com/ws/2'
end