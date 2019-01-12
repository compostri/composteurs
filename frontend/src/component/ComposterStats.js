import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
import {Typography, LinearProgress} from "@material-ui/core"
import { withTheme } from '@material-ui/core/styles'
import * as moment from 'moment'

import Api from '../utils/Api'
import {AppContext} from "../app-context"


class ComposterStats extends Component{



  constructor( props ) {
    super( props )

    const { theme } = props

    this.state = {
      loading: false,
      data: null
    }

    this.dataFormat = {
      labels: [],
      datasets: [
        {
          label: 'Nombre d‘utilisateurs',
          fill: true,
          lineTension: 0.1,
          backgroundColor: theme.palette.primary.light,
          borderColor: theme.palette.primary.main,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: theme.palette.primary.main,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: theme.palette.primary.main,
          pointHoverBorderColor: theme.palette.primary.dark,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: []
        },
        {
          label: 'Nombre de sceaux',
          fill: true,
          lineTension: 0.1,
          backgroundColor: theme.palette.secondary.light,
          borderColor: theme.palette.secondary.main,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: theme.palette.secondary.main,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: theme.palette.secondary.main,
          pointHoverBorderColor: theme.palette.secondary.dark,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: []
        }
      ]
    }
  }

  componentDidMount() {
    this.mounted = true
    this.getStats()
  }

  async getStats(){
    const { selectedComposter } = this.context

    this.setState({loading :true})

    const permanences = await Api.getStatsByComposter( selectedComposter.id )

    this.setState({loading :false})
    if( permanences.status === 200 && this.mounted) {

      const permToDisplay = permanences.data.filter( p => p.nbUsers !== null )

      this.dataFormat.labels = permToDisplay.map( function ( perm ) {
        let date = moment( perm.date ).format( 'D MMM YYYY')
        if( perm.eventTitle ){
          date += ` (${perm.eventTitle})`
        }
        return date
      })
      this.dataFormat.datasets[0].data = permToDisplay.map( function ( perm ) {
        return perm.nbUsers
      })
      this.dataFormat.datasets[1].data = permToDisplay.map( function ( perm ) {
        return perm.nbBuckets
      })

      this.setState({
        data: this.dataFormat,
        loading: false
      })
    }
  }

  componentWillUnmount(){
    this.mounted = false;
  }

  render() {
    const { data, loading } = this.state

    return (
      <div>
        <Typography component="h2" variant="h5" gutterBottom>Nombre d‘utilisateurs et de sceaux par date</Typography>

        { loading &&
          <LinearProgress />
        }
        { data &&
          <Line data={data} />
        }
      </div>
    );
  }
}
ComposterStats.contextType = AppContext

export default withTheme()(ComposterStats)