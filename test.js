var jdbc = require('jdbc');
var poolModule = require('generic-pool');

var config = {
  libpath: './drivers/mysql.jar',
  drivername: 'com.mysql.jdbc.Driver',
  url: 'jdbc:mysql://127.0.0.1:3306/odessa?user=node&password=pass'
};

jdbc.initialize(config, function(err, res) {
  if (err) {
    console.log(err);
  }
});


var genericQueryHandler = function(err, results) {
  if (err) {
    console.log("e "+err);
  } else {
    console.log("r "+JSON.stringify(results));
  }
};



var pool = poolModule.Pool({
    name     : 'mysql',
    create   : function(callback) {
        var client = require('jdbc');
        client.initialize(config, function(err, res) {
          if (err) {
            console.log("pool " + err);
          }
        });
        callback(null,client);
    },
    destroy  : function(client) { client.close(function(resp){console.log(resp);}); },
    max      : 1,
    // optional. if you set this, make sure to drain() (see step 3)
    min      : 1,
    // specifies how long a resource can stay idle in pool before being removed
    idleTimeoutMillis : 30000,
     // if true, logs via console.log - can also be a function
    log : true 
});


pool.acquire(function(err, client) {
    if (err) {
        console.log("err one "+err);
    } else {
        client.open(function(err, conn) {
          console.log('one');
          if (conn) {
            client.executeQuery("SELECT sleep(10) FROM dual", function(err,result){
               genericQueryHandler(err,result);
               pool.release(client);
            });
          }
        });
    }
});

pool.acquire(function(err, client) {
    if (err) {
        console.log("err two "+err);
    } else {
        client.open(function(err, conn) {
          console.log('two');
          if (conn) {
            client.executeQuery("SELECT sleep(5) FROM dual", function(err,result){
               genericQueryHandler(err,result);
               pool.release(client);
            });
          }
        });
    }
});

pool.acquire(function(err, client) {
    if (err) {
        console.log("err three "+err);
    } else {
        client.open(function(err, conn) {
          console.log('three');
          if (conn) {
            client.executeQuery("SELECT sysdate() FROM dual", function(err,result){
               genericQueryHandler(err,result);
               pool.release(client);
            });
          }
        });
    }
});

pool.drain(function() {
    pool.destroyAllNow();
});

// returns factory.name for this pool
console.log(pool.getName());

// returns number of resources in the pool regardless of
// whether they are free or in use
console.log(pool.getPoolSize());

// returns number of unused resources in the pool
console.log(pool.availableObjectsCount());

// returns number of callers waiting to acquire a resource
console.log(pool.waitingClientsCount());
