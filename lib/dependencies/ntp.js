/*
    Original file at:
    https://raw.githubusercontent.com/papio/ntp.js/master/static/ntp.js
*/
import { ArrayUtils } from "/obvia/lib/ArrayUtils.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";

var ntp = function (_props)
{
    let _defaultParams = {
        trips: 100
    };

    ObjectUtils.fromDefault(_defaultParams, _props);

    let _roundtrips = [];
    let _fetchPromise = _props.fetchPromise;
    let _tripsSoFar = 0;
    let _trips = _props.trips;

    this.sync = async function ()
    {
        _tripsSoFar = 0;
        _roundtrips = [];

        while (_tripsSoFar < _trips)
        {
            let times = await _fetchPromise(new Date().getTime());
            let parts = times.split("|");
            let clientReceive = new Date().getTime();
            let clientSend = parseInt(parts[0]);
            let server = parseInt(parts[1]);

            let lastOffset = (clientReceive + clientSend) / 2 - server;

            _roundtrips.push({
                'clientSend': clientSend
                , 'server': server
                , 'clientReceive': clientReceive
            });
            _tripsSoFar++;
        }
    };

    this.serverDate = function ()
    {
        let tmp = new Date();
        tmp.setTime(tmp.getTime() - this.offset());
        return tmp;
    };

    this.best = function ()
    {
        let delays = _roundtrips.map(trip => trip.clientReceive - trip.clientSend);
        let lowestDelay = ArrayUtils.min(delays);
        let len = delays.length;
        let bestTrips = []; //Trips with low delay
        for (let i = 0; i < len; i++)
        {
            if (delays[i] === lowestDelay)
            {
                bestTrips.push(_roundtrips[i]);
            }
        }
        return bestTrips;
    };

    this.offset = function ()
    {
        return ArrayUtils.mean(this.best().map(trip => (trip.clientReceive + trip.clientSend) / 2 - trip.server));
    };
};
export { ntp };